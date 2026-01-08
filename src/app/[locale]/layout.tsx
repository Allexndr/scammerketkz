import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation';
import { UserProvider } from '@/context/UserContext';
import NextAuthProvider from '@/components/NextAuthProvider';
import '../globals.css';

export const metadata = {
    title: 'ScammerKetKz - Платформа против мошенничества',
    description: 'Проверьте номер телефона на мошенничество. Единая база мошенников Казахстана.',
};

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className="antialiased min-h-screen pt-20">
                <NextIntlClientProvider messages={messages}>
                    <NextAuthProvider>
                        <UserProvider>
                            <Navigation />
                            {children}
                        </UserProvider>
                    </NextAuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
