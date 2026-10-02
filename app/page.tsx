const tutors = [
  {
    name: 'Анна Смирнова',
    subject: 'Python для начинающих',
    description: 'Помогает детям сделать первые шаги в программировании.',
  },
  {
    name: 'Иван Петров',
    subject: 'Веб-разработка',
    description: 'HTML, CSS и JavaScript для школьников.',
  },
  {
    name: 'Мария Волкова',
    subject: 'Scratch и алгоритмы',
    description: 'Развивает алгоритмическое мышление через игровые проекты.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-16">
      <section className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Coding Tutors
        </p>

        <h1 className="mb-4 text-4xl font-bold text-slate-900">
          Репетиторы по программированию для детей
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-slate-600">
          Найдите преподавателя, который поможет ребёнку освоить программирование
          и создать первый проект.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {tutors.map((tutor) => (
            <article
              key={tutor.name}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                {tutor.name}
              </h2>

              <p className="mb-3 font-medium text-blue-600">
                {tutor.subject}
              </p>

              <p className="text-slate-600">{tutor.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
