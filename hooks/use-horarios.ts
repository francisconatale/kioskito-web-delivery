import { useState, useEffect } from 'react';
import { horariosService } from '@/lib/horarios-service';

export function useHorarios(negocioId: number = 1) {
  const [isAbierto, setIsAbierto] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      try {
        const { abierto } = await horariosService.checkAbierto(negocioId);
        if (mounted) {
          setIsAbierto(abierto);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking horario status:", error);
        if (mounted) {
          setIsAbierto(false); // Fail closed or open? Spec says block, so if backend fails, maybe keep it closed? Or open to not block sales on error. Let's fail open to prevent blocking if API is glitching, wait no, let's fail closed for safety, actually let's just stick to what we got.
          setLoading(false);
        }
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 60000); // Check every minute

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [negocioId]);

  return { isAbierto, loading };
}
