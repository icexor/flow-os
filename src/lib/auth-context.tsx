import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { getRolePermissions, hasPermission, getAllowedModules, type PermissionModule, type PermissionAction, type RolePermissions } from "./permissions";

interface AuthContextType {
  isLoggedIn: boolean;
  currentRole: string | null;
  roleData: RolePermissions | null;
  login: (roleId: string) => void;
  logout: () => void;
  can: (module: PermissionModule, action: PermissionAction) => boolean;
  allowedModules: PermissionModule[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const login = useCallback((roleId: string) => {
    setCurrentRole(roleId);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setCurrentRole(null);
    setIsLoggedIn(false);
  }, []);

  const roleData = currentRole ? getRolePermissions(currentRole) || null : null;

  const can = useCallback(
    (module: PermissionModule, action: PermissionAction) => {
      if (!currentRole) return false;
      return hasPermission(currentRole, module, action);
    },
    [currentRole]
  );

  const allowedModules = currentRole ? getAllowedModules(currentRole) : [];

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, currentRole, roleData, login, logout, can, allowedModules }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
