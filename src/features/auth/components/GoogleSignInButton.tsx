import { Button } from '@/components/ui/Button';

/**
 * Google marka kurallarına göre beyaz zemin + resmi "G" logosu önerilir.
 * Logoyu https://developers.google.com/identity/branding-guidelines adresinden
 * indirip assets/ altına koyup buraya ekleyebilirsin.
 */
export function GoogleSignInButton(props: { onPress: () => void; loading?: boolean; disabled?: boolean }) {
  return <Button label="Google ile devam et" variant="light" {...props} />;
}
