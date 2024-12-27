import {defaultTheme, extendTheme, ThemeProvider} from '@inkjs/ui'
import {PropsWithChildren} from 'react'

export const Theme = ({children}: PropsWithChildren) => {
  return (
    <ThemeProvider
      theme={extendTheme(defaultTheme, {
        components: {
          ProgressBar: {styles: {completed: () => ({color: 'yellow'})}},
          Select: {
            styles: {
              focusIndicator: () => ({color: 'yellow'}),
              label: ({isFocused, isSelected}) => {
                return {color: isFocused ? 'yellow' : isSelected ? 'yellow' : 'gray'}
              },
              selectedIndicator: () => ({color: 'yellow'}),
            },
          },
        },
      })}
    >
      {children}
    </ThemeProvider>
  )
}
