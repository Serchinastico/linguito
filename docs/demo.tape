Output demo.gif

Set WindowBar Colorful
Set FontSize 20
Set Width 1200
Set Height 1000
Set Margin 20
Set MarginFill "#6B50FF"
Set BorderRadius 10

# Set an alias for the command to make it look like we are running production's version
Hide
Type "alias linguito='npm run start --'"
Enter
Sleep 50ms
Show

# Type a command in the terminal.
Type@30ms "linguito translate test/fixtures/missing-translations --interactive --llm"
Sleep 500ms
Enter

Sleep 9s

# Navigate the different translations
Enter
Sleep 3s
Backspace 6
Type@200ms "Instrucciones"
Sleep 1s
Enter
Sleep 4s
Enter
Sleep 2s
