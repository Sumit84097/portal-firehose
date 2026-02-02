// 'use client';

// import { PrivyProvider } from '@privy-io/react-auth';
// import { useRouter } from 'next/navigation';

// export default function Providers({ children }: { children: React.ReactNode }) {
//   const router = useRouter();

//   return (
//     <PrivyProvider
//       appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
//       onLogin={(user) => {
//         console.log(`user ${user.id} logged in!`);
//   // Using window.location.assign ensures the browser 
//   // fully commits the login state to the /feed page.
//   window.location.assign('/feed');
//       }}
//       config={{
//         appearance: {
//           theme: 'dark',
//           accentColor: '#FFFFFF',
//           showWalletLoginFirst: false, // Keeps it focused on "Grandmother Test" logins
//         },
//         embeddedWallets: {
//           createOnLogin: 'users-without-wallets',
//         },
//         loginMethods: ['google', 'email', 'phone'],
//       }}
//     >
//       {children}
//     </PrivyProvider>
//   );
// }


'use client';

import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user, ready } = usePrivy();  // ← usePrivy() gives user, ready, etc.
  const router = useRouter();

  // Redirect to /feed after successful login
  useEffect(() => {
    if (ready && user) {
      console.log(`User logged in: ${user.id} (${user.email || user.google?.email || 'no email'})`);
      router.replace('/feed');
    }
  }, [ready, user, router]);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#FFFFFF',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        loginMethods: ['google', 'email', 'sms'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}