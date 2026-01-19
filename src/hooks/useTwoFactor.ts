import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TwoFactorState {
  isEnrolling: boolean;
  isVerifying: boolean;
  qrCode: string | null;
  secret: string | null;
  factorId: string | null;
}

export function useTwoFactor() {
  const { toast } = useToast();
  const [state, setState] = useState<TwoFactorState>({
    isEnrolling: false,
    isVerifying: false,
    qrCode: null,
    secret: null,
    factorId: null,
  });

  const enrollTOTP = async () => {
    setState(prev => ({ ...prev, isEnrolling: true }));
    
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        isEnrolling: false,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
        factorId: data.id,
      }));

      return { success: true, data };
    } catch (error: any) {
      setState(prev => ({ ...prev, isEnrolling: false }));
      toast({
        title: 'Error',
        description: error.message || 'Failed to set up 2FA',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const verifyTOTP = async (code: string) => {
    if (!state.factorId) {
      toast({
        title: 'Error',
        description: 'No factor ID found. Please restart the setup.',
        variant: 'destructive',
      });
      return { success: false };
    }

    setState(prev => ({ ...prev, isVerifying: true }));

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: state.factorId,
      });

      if (challengeError) throw challengeError;

      const { data, error } = await supabase.auth.mfa.verify({
        factorId: state.factorId,
        challengeId: challengeData.id,
        code,
      });

      if (error) throw error;

      setState({
        isEnrolling: false,
        isVerifying: false,
        qrCode: null,
        secret: null,
        factorId: null,
      });

      toast({
        title: 'Success',
        description: 'Two-factor authentication has been enabled.',
      });

      return { success: true, data };
    } catch (error: any) {
      setState(prev => ({ ...prev, isVerifying: false }));
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid code. Please try again.',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const unenrollTOTP = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Two-factor authentication has been disabled.',
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to disable 2FA',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const getFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      return { success: true, factors: data.totp };
    } catch (error: any) {
      return { success: false, factors: [], error };
    }
  };

  const cancelEnrollment = () => {
    setState({
      isEnrolling: false,
      isVerifying: false,
      qrCode: null,
      secret: null,
      factorId: null,
    });
  };

  return {
    ...state,
    enrollTOTP,
    verifyTOTP,
    unenrollTOTP,
    getFactors,
    cancelEnrollment,
  };
}
