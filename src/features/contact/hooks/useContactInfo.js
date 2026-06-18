import { useEffect } from 'react';
import { useContactStore } from '../../../store/useContactStore';

export function useContactInfo() {
  const { socialLinks, loading, fetchSocialLinks } = useContactStore();

  useEffect(() => {
    fetchSocialLinks();
  }, [fetchSocialLinks]);

  return { socialLinks, loading };
}
