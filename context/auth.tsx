import { auth, db } from '@/firebase/client';
import { User } from '@/types/user';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import {
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

type ContextType = {
  fbUser: FirebaseUser | null | undefined;
  user: User | null | undefined;
  isLoggedIn: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<ContextType>({
  fbUser: undefined,
  user: undefined,
  isLoggedIn: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>();
  const [user, setUser] = useState<User | null>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    onAuthStateChanged(auth, (resultUser) => {
      unsubscribe?.();

      if (resultUser) {
        const ref = doc(db, `users/${resultUser.uid}`);
        unsubscribe = onSnapshot(ref, (snap) => {
          setUser(snap.data() as User);
        });
      } else {
        setUser(null);
      }

      setFbUser(resultUser);
      setIsLoggedIn(!!resultUser);
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        fbUser,
        user,
        isLoggedIn,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
