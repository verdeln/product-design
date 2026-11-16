---
title: Editor SDK overview
description: The proposed portable editor boundary, host bridge and artifact-consumption model.
---

# Editor SDK overview

The Independent block editor owns document semantics, commands, transactions and document-level selection. It does not own Workspace membership, billing, routing or Cloud synchronization policy.

## One document authority

A standalone host can own a document session. Verdlen Workspace mode instead borrows the existing Workspace page authority. A React surface is a view and input host, not a second writer.

```ts
interface EditorHostBridge {
  read(): ReadonlyDocumentSnapshot
  dispatch(intent: EditorIntent): Promise<CommandResult>
  subscribe(listener: () => void): () => void
  release(): void
}
```

The interface above is a PoC documentation fixture, not a released Verdlen API.

## Artifact-first extraction

Before moving source to another repository, both a clean standalone consumer and the official application must install tested package artifacts without sibling source aliases or hidden `/internal` dependencies.

## Collection integration

A Collection view remains an editor extension with a separate Collection Authority. Moving a block into a board coordinates a semantic cross-domain gesture; it does not copy the Collection records into the document model.
