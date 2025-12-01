import { defineConfig } from 'orval';

export default defineConfig({
    skinTrades: {
        output: {
            mode: 'tags-split',
            target: 'src/api/generated/skinTrades.ts',
            schemas: 'src/api/generated/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/api/axios-instance.ts',
                    name: 'customInstance',
                },
            },
        },
        input: {
            target: './api-docs.json',
        },
    },
});
