import type { CommandListenerLowPriority, LexicalEditor } from 'lexical'

import {
  $handleListInsertParagraph,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  indentList,
  insertList,
  outdentList,
  removeList,
} from '@lexical/list'
import { mergeRegister } from '@lexical/utils'
import {
  INDENT_CONTENT_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical'
import { onMounted, onUnmounted } from 'vue'

const LowPriority: CommandListenerLowPriority = 1

export function useList(editor: LexicalEditor): void {
  let unregisterListener: () => void

  onMounted(() => {
    unregisterListener = mergeRegister(
      editor.registerCommand(
        INDENT_CONTENT_COMMAND,
        () => {
          const hasHandledIndention = indentList()
          if (hasHandledIndention)
            return true

          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        OUTDENT_CONTENT_COMMAND,
        () => {
          const hasHandledIndention = outdentList()
          if (hasHandledIndention)
            return true

          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          insertList(editor, 'ol')
          return true
        },
        LowPriority,
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          insertList(editor, 'ul')
          return true
        },
        LowPriority,
      ),
      editor.registerCommand(
        REMOVE_LIST_COMMAND,
        () => {
          removeList(editor)
          return true
        },
        LowPriority,
      ),
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          const hasHandledInsertParagraph = $handleListInsertParagraph()
          if (hasHandledInsertParagraph)
            return true

          return false
        },
        LowPriority,
      ),
    )
  })

  onUnmounted(() => {
    unregisterListener?.()
  })
}