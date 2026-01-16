import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User, RoleOption } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const user = this.getUserFromStorage();
    if (user) this.currentUserSubject.next(user);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data)
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  getAvailableRoles(): Observable<RoleOption[]> {
    return this.http.get<RoleOption[]>(`${environment.apiUrl}/auth/roles`);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const rolePermissions = user.role?.permissions?.map(p => p.nom) || [];
    const userPermissions = user.permissions?.map(p => p.nom) || [];
    return [...rolePermissions, ...userPermissions].includes(permission);
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    // Check both role.nom and roles array
    if (user.role?.nom === role) return true;
    if (user.roles?.includes(role)) return true;
    return false;
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    if (!user) return 'USER';
    // Return first role from roles array or role.nom
    if (user.roles && user.roles.length > 0) return user.roles[0];
    if (user.role?.nom) return user.role.nom;
    return 'USER';
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    const user: User = {
      id: response.userId,
      email: response.email,
      nom: response.username,
      prenom: response.username,
      roles: response.roles || [],
      permissions: response.permissions?.map((p, i) => ({ id: i, nom: p })) || []
    };
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
