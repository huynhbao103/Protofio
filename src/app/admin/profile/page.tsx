import ProfileManager from '@/components/ProfileManager'

export default function AdminProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-primary to-orange-50 dark:from-dark-bg dark:to-dark-card py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brown-primary dark:text-orange-300 mb-2">
            👤 Quản lý Profile
          </h1>
          <p className="text-brown-600 dark:text-gray-300">
            Cập nhật thông tin cá nhân và avatar
          </p>
        </div>

        <ProfileManager />
      </div>
    </div>
  )
}
