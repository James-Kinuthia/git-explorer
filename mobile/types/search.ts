export interface SearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  loading: boolean;
  buttonText?: string;
  onSubmit: () => void;
}