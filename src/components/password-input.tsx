import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { ComponentProps, forwardRef, useState } from 'react'

import { Button } from './ui/button'
import { Input } from './ui/input'

type PasswordInputProps = ComponentProps<'input'>

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ placeholder, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prevValue) => !prevValue)
    }

    return (
      <div className="relative w-full">
        <Input
          {...props}
          ref={ref}
          placeholder={placeholder}
          type={isPasswordVisible ? 'text' : 'password'}
          className="bg-card"
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute bottom-0 right-0 top-0 my-auto mr-1 size-8 text-muted-foreground"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    )
  }
)

export default PasswordInput
