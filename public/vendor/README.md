# Self-hosted 3D decoders (Baboo 2.13.11)

model-viewer loads these only when a model is compressed. Before 2.13.11 it fetched them from www.gstatic.com.
They are byte-for-byte copies of Google's published files, at the same versions model-viewer pins
(`src/studio/components/ModelPeek.tsx` points model-viewer here).

| File | Source | SHA-1 | License |
|---|---|---|---|
| draco/1.5.6/draco_decoder.js | https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js | dc7f397e2a2ebac49e5eba3dfc568d8b7e4db38f | Apache-2.0 (google/draco) |
| draco/1.5.6/draco_decoder.wasm | https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm | b048235474cbf09ef35e5861a74a747f4bef3fa1 | Apache-2.0 (google/draco) |
| draco/1.5.6/draco_wasm_wrapper.js | https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js | 6263f3a4b71cdf3bb975da0f698212e0ba2d1bb2 | Apache-2.0 (google/draco) |
| basis/2021-04-15-ba1c3e4/basis_transcoder.js | https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/basis_transcoder.js | 1ea211086a1a498f7ea65d98970ad6f70b3f8d04 | Apache-2.0 (BinomialLLC/basis_universal) |
| basis/2021-04-15-ba1c3e4/basis_transcoder.wasm | https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/basis_transcoder.wasm | 7338e09b9e45089ca077e12eaf866a4a9e37753a | Apache-2.0 (BinomialLLC/basis_universal) |

Apache-2.0 text: https://www.apache.org/licenses/LICENSE-2.0
