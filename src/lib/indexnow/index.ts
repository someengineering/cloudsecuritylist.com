import 'server-only';

import { apiKey as key } from '@/lib/indexnow/key';
import { getSiteUrl, getUpdatedUrls } from '@/lib/sanity';

export const submitUrls = async () => {
  const url = await getSiteUrl();
  const host = new URL(url ?? '').hostname;

  const urlList = await getUpdatedUrls();

  if (urlList.length) {
    const response = await fetch(`https://api.indexnow.org/indexnow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${url}/${key}.txt`,
        urlList,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to submit URLs to IndexNow: ${response.statusText}`,
      );
    }
  }
};
