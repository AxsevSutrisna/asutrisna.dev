import { supabase } from '../config/supabase';

export const heroContentService = {
    async fetchActiveHeroContent() {
        const { data, error } = await supabase
            .from('hero_contents')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    },

    subscribeToChanges(callback) {
        const subscription = supabase
            .channel('hero_content_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'hero_contents',
                },
                () => {
                    callback();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }
};
