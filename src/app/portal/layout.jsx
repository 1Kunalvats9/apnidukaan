'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import LayoutComponent from '../components/layout/Layout'; 

export default function ProtectedPortalLayout({ children }) { 
  const { user, loading } = useAuth();
  const router = useRouter();

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //       <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
  //     </div>
  //   );
  // }

  return <LayoutComponent>{children}</LayoutComponent>;
}