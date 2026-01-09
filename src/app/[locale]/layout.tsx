import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation';
import { UserProvider } from '@/context/UserContext';
import NextAuthProvider from '@/components/NextAuthProvider';
import '../globals.css';
import Navbar from '@/components/Navbar';
import TelegramProvider from '@/components/TelegramProvider';

export const metadata = {
    title: 'ScammerKetKz - Платформа проверки номеров',
    description: 'Проверьте номер телефона на наличие жалоб. Единая база отзывов Казахстана.',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Важно для TWA, чтобы не зумилось
}

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
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <NextAuthProvider>
                        <UserProvider>
                            <TelegramProvider>
                                <Navbar />
                                {children}
                            </TelegramProvider>
                        </UserProvider>
                    </NextAuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
