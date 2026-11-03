import type { Dictionary } from '../types'

const vi: Dictionary = {
  nav: {
    home: 'Trang chủ',
    about: 'Giới thiệu',
    value: 'Vì sao tuyển',
    skills: 'Kỹ năng',
    projects: 'Dự án',
    contact: 'Liên hệ',
    admin: 'Admin',
    login: 'Đăng nhập',
    logout: 'Đăng xuất',
  },
  common: {
    name: 'Huỳnh Quốc Bảo',
    title: 'Frontend Developer',
    language: 'Ngôn ngữ',
    darkMode: 'Chế độ tối',
    lightMode: 'Chế độ sáng',
  },
  home: {
    contactCta: 'Liên hệ với tôi',
    learnMore: 'Tìm hiểu thêm',
    shortBio:
      'Frontend Developer với 1 năm kinh nghiệm thực tế xây dựng và duy trì ứng dụng web cho hệ thống nội bộ doanh nghiệp và sản phẩm hướng tới khách hàng. Thành thạo React.js, Next.js, TypeScript; có kinh nghiệm tích hợp API và xử lý vấn đề kỹ thuật tầng frontend.',
    downloadCv: 'Tải CV',
  },
  impact: {
    heading: 'Số liệu nổi bật',
    items: [
      { value: '1+', label: 'Năm kinh nghiệm thực tế' },
      { value: 'KR', label: 'Làm remote với công ty và khách hàng Hàn Quốc' },
      { value: 'AI', label: 'Workflow AI nâng hiệu suất' },
    ],
  },
  about: {
    heading: 'Giới thiệu',
    greeting: 'Xin chào! Tôi là',
    studentNote:
      'Đã tốt nghiệp ngành Công nghệ phần mềm tại HUFLIT (2022–2026). Hiện tập trung phát triển ứng dụng web hiện đại và các sản phẩm thực tế.',
    mainSkills: 'Kỹ năng chính:',
    experience: 'Kinh nghiệm',
    education: 'Học vấn',
    bio: 'Frontend Developer với 1 năm kinh nghiệm thực tế xây dựng và duy trì ứng dụng web cho hệ thống nội bộ doanh nghiệp và sản phẩm hướng tới khách hàng. Thành thạo React.js, Next.js và TypeScript; có kinh nghiệm tích hợp API và xử lý các vấn đề kỹ thuật ở tầng frontend.',
    experienceItems: [
      {
        title: 'Frontend Developer',
        company: 'KKAL Entertainment Company Limited',
        period: '09/2025 – Hiện tại',
        description:
          'Remote với đội phát triển phần mềm Hàn Quốc trên hệ thống nội bộ và web cho khách hàng Hàn. Xây dựng/duy trì UI, interactive features và tích hợp API bằng React, Next.js, JavaScript, TypeScript; tối ưu performance và troubleshoot để đáp ứng yêu cầu client.',
      },
    ],
    educationItems: [
      {
        degree: 'Cử nhân Công nghệ thông tin / Kỹ thuật phần mềm',
        institution: 'Đại học Ngoại ngữ – Tin học TP. Hồ Chí Minh (HUFLIT)',
        period: '2022 – 2026',
        description: 'Đã tốt nghiệp ngành Công nghệ phần mềm; đã tham gia nhiều dự án phần mềm thực tế trong quá trình học.',
      },
    ],
  },
  value: {
    heading: 'Vì sao nên tuyển tôi',
    subtitle:
      '',
    items: [
      {
        title: 'Ship sản phẩm thật',
        description: 'Đã làm hệ thống nội bộ và web cho khách hàng thực tế, không chỉ demo cá nhân.',
      },
      {
        title: 'Remote-ready',
        description: 'Kinh nghiệm cộng tác xuyên biên giới với đội Hàn Quốc: giao tiếp rõ, bàn giao đúng hạn.',
      },
      {
        title: 'Frontend vững + API fluent',
        description: 'React/Next/TypeScript là điểm mạnh; quen tích hợp REST API và xử lý lỗi tầng UI.',
      },
      {
        title: 'Tối ưu & troubleshoot',
        description: 'Chủ động đo hiệu năng, sửa bug nhanh, giữ trải nghiệm ổn định cho người dùng.',
      },
    ],
    aiTitle: 'Lập trình với AI — nâng hiệu suất làm việc',
    aiBody:
      'Tôi dùng AI (Cursor, Copilot…) như trợ lý kỹ thuật: tăng tốc boilerplate, review code, viết test và tìm nguyên nhân lỗi — vẫn giữ kiểm soát chất lượng và quyết định kiến trúc.',
    aiPoints: [
      'Rút ngắn thời gian dựng UI/component và wiring API',
      'Hỗ trợ debug, refactor và viết test nhanh hơn',
      'Giữ tiêu chuẩn code review: AI đề xuất, người quyết định',
      'Tập trung hơn vào UX, edge case và giá trị sản phẩm',
    ],
  },
  skills: {
    heading: 'Kỹ năng & Công nghệ',
    subtitle: 'Công nghệ và kỹ năng tôi dùng trong công việc và các dự án thực tế',
    technologies: 'Công nghệ',
    categories: [
      {
        title: 'Frontend',
        skills: [
          { name: 'React.js', level: 85 },
          { name: 'Next.js', level: 85 },
          { name: 'TypeScript', level: 80 },
          { name: 'JavaScript', level: 80 },
          { name: 'HTML/CSS', level: 90 },
          { name: 'Tailwind CSS', level: 85 },
          { name: 'Ant Design', level: 80 },
        ],
      },
      {
        title: 'Backend & Database',
        skills: [
          { name: 'Node.js', level: 70 },
          { name: 'Express.js', level: 65 },
          { name: 'RESTful APIs', level: 80 },
          { name: 'MongoDB', level: 75 },
          { name: 'PostgreSQL / SQL Server', level: 60 },
          { name: 'Supabase', level: 65 },
        ],
      },
      {
        title: 'Công cụ & Khác',
        skills: [
          { name: 'Git / GitHub', level: 85 },
          { name: 'VS Code / Cursor', level: 90 },
          { name: 'Responsive Design', level: 85 },
        ],
      },
    ],
    tags: [
      'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express.js',
      'MongoDB', 'PostgreSQL', 'Supabase', 'Ant Design', 'Tailwind CSS', 'GitHub',
    ],
  },
  projects: {
    heading: 'Dự án',
    subtitle: 'Dự án chọn lọc từ CV và các sản phẩm đã triển khai',
    featuredHeading: 'Dự án nổi bật trên CV',
    featuredSubtitle: 'Hai dự án then chốt thể hiện khả năng ship sản phẩm và làm việc với hệ thống thật',
    moreHeading: 'Thêm dự án trên portfolio',
    loading: 'Đang tải dự án...',
    technologiesUsed: 'Công nghệ sử dụng:',
    viewCode: 'Xem mã nguồn',
    liveDemo: 'Xem demo',
    activeProject: 'Dự án đang hoạt động',
    noPreview: 'Chưa có preview',
    inDevelopment: 'Dự án đang phát triển',
    empty: 'Không có dự án nào',
    reload: 'Tải lại',
    connectionError: 'Lỗi kết nối',
    retry: 'Thử lại',
    demoNotice: 'Đang sử dụng dữ liệu demo',
    demoDescription: 'Dữ liệu hiện tại là demo. Vui lòng kiểm tra kết nối database để xem dữ liệu thực.',
    fetchError: 'Không thể tải danh sách dự án',
    demoFallback: 'Đang hiển thị dữ liệu demo. Vui lòng kiểm tra kết nối database.',
    featured: [
      {
        name: 'AI Food Recommendation System',
        role: 'Đồ án tốt nghiệp | Full-stack Developer',
        period: '05/2025 – 08/2025',
        summary:
          'Hệ thống gợi ý món ăn dùng AI (GPT + LangGraph), thiết kế UI theo từng tính năng và tham gia kiến trúc tích hợp recommendation.',
        highlights: [
          'Xây dựng hệ thống recommendation dùng GPT và LangGraph',
          'Thiết kế & triển khai giao diện cho các nhóm tính năng khác nhau',
          'Đóng góp kiến trúc ứng dụng và tích hợp luồng gợi ý AI',
        ],
        stack: ['React', 'Next.js', 'TypeScript', 'GPT', 'LangGraph', 'Node.js'],
      },
      {
        name: 'Document Management System — Nam Sài Gòn',
        role: 'Frontend Developer',
        period: '12/2024 – 12/2025',
        summary:
          'Nền tảng quản lý tài liệu hỗ trợ workflow đa phòng ban: phê duyệt, điều hướng, hạn xử lý và tích hợp API vận hành.',
        highlights: [
          'Phát triển giao diện quản lý tài liệu theo quy trình liên phòng ban',
          'Implement UI phê duyệt, routing và quản lý deadline',
          'Tích hợp frontend với API cho các thao tác tài liệu và workflow',
        ],
        stack: ['React', 'TypeScript', 'REST API', 'Ant Design'],
      },
    ],
  },
  contact: {
    heading: 'Liên hệ',
    subtitle: 'Sẵn sàng trao đổi về vị trí Frontend. Hãy gửi lời mời phỏng vấn!',
    infoTitle: 'Thông tin liên hệ',
    email: 'Email',
    phone: 'Điện thoại',
    address: 'Địa chỉ',
    addressValue: 'Phường Tân Phú, TP. Hồ Chí Minh',
    connect: 'Kết nối với tôi',
    formTitle: 'Gửi tin nhắn',
    name: 'Họ và tên',
    namePlaceholder: 'Nhập họ và tên của bạn',
    nameRequired: 'Vui lòng nhập họ tên!',
    emailLabel: 'Email',
    emailPlaceholder: 'Nhập địa chỉ email của bạn',
    emailRequired: 'Vui lòng nhập email!',
    emailInvalid: 'Email không hợp lệ!',
    subject: 'Chủ đề',
    subjectPlaceholder: 'Chủ đề tin nhắn',
    subjectRequired: 'Vui lòng nhập chủ đề!',
    message: 'Tin nhắn',
    messagePlaceholder: 'Nội dung tin nhắn...',
    messageRequired: 'Vui lòng nhập tin nhắn!',
    send: 'Gửi tin nhắn',
    sending: 'Đang gửi...',
    success: 'Cảm ơn bạn! Tin nhắn đã được gửi thành công. Tôi sẽ liên hệ lại sớm nhất có thể.',
    error: 'Có lỗi xảy ra khi gửi tin nhắn.',
    genericError: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
  },

}

export default vi
