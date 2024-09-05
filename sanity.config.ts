'use client';

import { apiVersion, dataset, projectId } from '@/lib/sanity/env';
import { schema } from '@/lib/sanity/schemas';
import { structure } from '@/lib/sanity/structure';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
