import { useEffect } from 'react';
import { useProjectStore } from '../../../store/useProjectStore';

export function useProjects() {
  const { projects, loading, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refresh = () => fetchProjects(true);

  return { projects, loading, refresh };
}
