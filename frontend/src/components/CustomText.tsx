import { type ReactNode } from 'react';
import { Text, type TextProps } from '@mantine/core';

interface CustomTextProps extends TextProps {
  children: ReactNode;
}

export default function CustomText({ children, ...rest }: CustomTextProps) {
  return (
    <Text fz={{ base: 'sm', sm: 'md' }} {...rest}>
      {children}
    </Text>
  );
}
