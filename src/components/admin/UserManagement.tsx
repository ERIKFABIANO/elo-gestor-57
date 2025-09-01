import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

export const UserManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [deletingUser, setDeletingUser] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({
    display_name: '',
    email: '',
    avatar_url: '',
    role: '',
    new_password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('common.error'),
        description: 'Erro ao carregar usuários',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: Profile) => {
    setEditingUser(user);
    setEditForm({
      display_name: user.display_name,
      email: user.email,
      avatar_url: user.avatar_url || '',
      role: user.role,
      new_password: '',
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.display_name,
          email: editForm.email,
          avatar_url: editForm.avatar_url || null,
          role: editForm.role,
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Update auth user email if changed
      if (editForm.email !== editingUser.email) {
        const { error: emailError } = await supabase.auth.admin.updateUserById(
          editingUser.user_id,
          { email: editForm.email }
        );
        
        if (emailError) {
          console.warn('Could not update auth email:', emailError);
        }
      }

      // Update password if provided
      if (editForm.new_password.trim()) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          editingUser.user_id,
          { password: editForm.new_password }
        );
        
        if (passwordError) {
          console.warn('Could not update password:', passwordError);
        }
      }

      toast({
        title: t('common.success'),
        description: 'Usuário atualizado com sucesso',
      });

      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: t('common.error'),
        description: 'Erro ao atualizar usuário',
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      // Delete from auth (this will cascade to profiles due to foreign key)
      const { error } = await supabase.auth.admin.deleteUser(deletingUser.user_id);
      
      if (error) throw error;

      toast({
        title: t('common.success'),
        description: 'Usuário excluído com sucesso',
      });

      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: t('common.error'),
        description: 'Erro ao excluir usuário',
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          {t('admin.userManagement')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">{t('admin.loading')}</div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('admin.noUsers')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.name')}</TableHead>
                <TableHead>{t('admin.email')}</TableHead>
                <TableHead>{t('admin.role')}</TableHead>
                <TableHead>{t('admin.createdAt')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.display_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingUser(user)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.editUser')}</DialogTitle>
              <DialogDescription>
                Faça as alterações necessárias no usuário.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="display_name">{t('admin.name')}</Label>
                <Input
                  id="display_name"
                  value={editForm.display_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">{t('admin.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="avatar_url">{t('admin.profilePhoto')}</Label>
                <Input
                  id="avatar_url"
                  placeholder="URL da foto"
                  value={editForm.avatar_url}
                  onChange={(e) => setEditForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="role">{t('admin.role')}</Label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new_password">{t('admin.newPassword')}</Label>
                <Input
                  id="new_password"
                  type="password"
                  placeholder="Deixe em branco para não alterar"
                  value={editForm.new_password}
                  onChange={(e) => setEditForm(prev => ({ ...prev, new_password: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                {t('admin.cancel')}
              </Button>
              <Button onClick={handleSaveUser}>
                {t('admin.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('admin.confirmDelete')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('admin.deleteMessage')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('admin.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};