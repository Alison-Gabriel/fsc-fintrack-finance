import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface PasswordInputProps {
  placeholder: string
}

const PasswordInput = ({ placeholder }: PasswordInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevValue) => !prevValue)
  }

  return (
    <div className="relative w-full">
      <Input
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder={placeholder}
      />
      <Button
        variant="ghost"
        className="absolute bottom-0 right-0 top-0 my-auto mr-1 size-8 rounded-sm text-muted-foreground"
        onClick={togglePasswordVisibility}
      >
        {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  )
}

export default PasswordInput
