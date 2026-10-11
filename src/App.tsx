import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

type Filter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'taskflow-tasks'

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as Task[] : []
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [title, setTitle] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !task.completed) ||
        (filter === 'completed' && task.completed)

      return matchesSearch && matchesFilter
    })
  }, [tasks, search, filter])

  const completedCount = tasks.filter(task => task.completed).length

  function addTask(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    setTasks(current => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ])
    setTitle('')
  }

  function toggleTask(id: string) {
    setTasks(current =>
      current.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  function deleteTask(id: string) {
    setTasks(current => current.filter(task => task.id !== id))
  }

  function saveEdit(id: string) {
    const trimmed = editingTitle.trim()
    if (!trimmed) return

    setTasks(current =>
      current.map(task =>
        task.id === id ? { ...task, title: trimmed } : task
      )
    )
    setEditingId(null)
    setEditingTitle('')
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <span className="eyebrow">PRODUCTIVITY DASHBOARD</span>
          <h1>TaskFlow</h1>
          <p>今日やることを整理して、一歩ずつ進めよう。</p>
        </div>
        <span className="header-badge">TypeScript + React</span>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>すべてのタスク</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="stat-card">
          <span>未完了</span>
          <strong>{tasks.length - completedCount}</strong>
        </div>
        <div className="stat-card">
          <span>完了</span>
          <strong>{completedCount}</strong>
        </div>
      </section>

      <section className="panel">
        <h2>タスクを追加</h2>
        <form className="add-form" onSubmit={addTask}>
          <input
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="新しいタスクを入力..."
            maxLength={100}
          />
          <button type="submit">＋ 追加する</button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>タスク一覧</h2>
          <span>{filteredTasks.length} 件</span>
        </div>

        <div className="toolbar">
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="タスクを検索..."
          />
          <div className="filters">
            {([
              ['all', 'すべて'],
              ['active', '未完了'],
              ['completed', '完了'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={filter === value ? 'selected' : ''}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty">
            タスクがありません。新しいタスクを追加しましょう！
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map(task => (
              <li key={task.id} className="task-item">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`${task.title}の完了状態`}
                />

                {editingId === task.id ? (
                  <form
                    className="edit-form"
                    onSubmit={event => {
                      event.preventDefault()
                      saveEdit(task.id)
                    }}
                  >
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={event =>
                        setEditingTitle(event.target.value)
                      }
                      maxLength={100}
                    />
                    <button type="submit">保存</button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => setEditingId(null)}
                    >
                      戻る
                    </button>
                  </form>
                ) : (
                  <>
                    <span className={task.completed ? 'done' : ''}>
                      {task.title}
                    </span>
                    <div className="task-actions">
                      <button
                        className="secondary"
                        onClick={() => {
                          setEditingId(task.id)
                          setEditingTitle(task.title)
                        }}
                      >
                        編集
                      </button>
                      <button
                        className="danger"
                        onClick={() => deleteTask(task.id)}
                      >
                        削除
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer>TaskFlow · Built with TypeScript & React</footer>
    </main>
  )
}

export default App