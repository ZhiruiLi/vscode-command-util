# VSCode Ditto

Ditto helps you to copy context senitive text in command.

Example:

When adding breakpoint in gdb, you may want to copy current file name and lineno with format
`FILENAME:LINENO`. It's hard to find one plugin to satisfy various requirements.

With Ditto, just add key binding like:

```jsonc
"vim.normalModeKeyBindingsNonRecursive": [
  {
    "before": [ "<leader>", "f", "y" ], "commands": [
      {
        "command": "ditto.copyText",
        "args": "{{path_basename activeEditor.document.filePath}}:{{add activeEditor.selection.active.line 1}}"
      }
    ]
  }, // yank filename and lineno
]
```
