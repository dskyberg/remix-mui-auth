import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { RemixServer } from '@remix-run/react';
import createEmotionCache from './src/createEmotionCache';
import theme from './src/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  function MuiRemixServer() {
    return (
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY}/>
        </ThemeProvider>
      </CacheProvider>
    );
  }

  // Render the component to a string.
  const html = ReactDOMServer.renderToString(<MuiRemixServer />);

  // Grab the CSS from emotion
  const { styles } = extractCriticalToChunks(html);

  let stylesHTML = '';
  
  for(const { key, ids, css } of styles) {
    const emotionKey = `${key} ${ids.join(' ')}`;
    const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`;
    stylesHTML = `${stylesHTML}${newStyleTag}`;

  }

  // Add the Emotion style tags after the insertion point meta tag
  const markup = html.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`,
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
