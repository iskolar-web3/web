import {
	createContext,
	type JSX,
	type ReactNode,
	useContext,
	useState,
	useEffect,
} from "react";
import { deleteCookie, getCookie } from "./lib/cookie";
import type { AuthSession, User } from "./lib/user/model";
import { ACCESS_TOKEN_KEY, validateSession } from "./lib/user/auth";

export type AuthContextValue = {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	sessionToken: string;
	getSession: () => Promise<AuthSession | null>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
	children: ReactNode;
};

export function AuthProvider(props: AuthProviderProps): JSX.Element {
	const [user, setUser] = useState<User | null>(null);
	const [sessionToken, setSessionToken] = useState<string>("");

	async function getSession(): Promise<AuthSession | null> {
		const token = getCookie(ACCESS_TOKEN_KEY);
		if (!token) {
			return null;
		}

		const session = await validateSession(token);
		if (session === null) {
			setUser(null);
			return null;
		}

        console.log("Session:", session)

		setUser(session.user);
		setSessionToken(token);

		return session;
	}

	async function logout(): Promise<void> {
		const token = getCookie(ACCESS_TOKEN_KEY);
		if (!token || !user) {
			return;
		}

		// TODO: Implement logout

		setUser(null);
		deleteCookie(ACCESS_TOKEN_KEY);
	}

	useEffect(() => {
		getSession();
	}, []);

	return (
		<AuthContext value={{ user, setUser, getSession, logout, sessionToken }}>
			{props.children}
		</AuthContext>
	);
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
