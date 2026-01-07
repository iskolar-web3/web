import {
	createContext,
	type JSX,
	type ReactNode,
	useContext,
	useState,
	useEffect,
} from "react";
import { deleteCookie, getCookie } from "./lib/cookie";
import { UserRole, type AuthSession, type User } from "./lib/user/model";
import { ACCESS_TOKEN_KEY, validateSession } from "./lib/user/auth";
import { getMyStudentProfile } from "./lib/student/api";
import { getMySponsorProfile } from "./lib/sponsor/api";

export type AuthContextValue<T = any> = {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	profile: T;
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
	const [profile, setProfile] = useState<any | null>(null);

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

		setUser(session.user);
		setSessionToken(token);

		switch (session.user.role?.code) {
			case UserRole.Student:
				const student = await getMyStudentProfile(token);
				setProfile(student);
				break;

			case UserRole.Sponsor:
				const sponsor = await getMySponsorProfile(token);
				setProfile(sponsor);
				break;

			default:
				setProfile(null);
		}

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
		<AuthContext
			value={{ user, setUser, profile, getSession, logout, sessionToken }}
		>
			{props.children}
		</AuthContext>
	);
}

export function useAuth<T = any>(): AuthContextValue<T> {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context as AuthContextValue<T>;
}
