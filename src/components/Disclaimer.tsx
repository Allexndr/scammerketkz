import { AlertTriangle } from 'lucide-react'

export default function Disclaimer() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <h3 className="font-semibold text-yellow-800 mb-2">Важное предупреждение</h3>
          <div className="text-yellow-700 space-y-1">
            <p>
              <strong>AntiScamKZ</strong> — это краудсорсинг-платформа. Все данные вносятся пользователями добровольно.
            </p>
            <p>
              <strong>Мы не модерируем контент.</strong> Верификация происходит через голосование пользователей (лайки/дизлайки).
            </p>
            <p>
              <strong>Мы не несем ответственности</strong> за достоверность информации. Все данные могут быть ошибочными или устаревшими.
            </p>
            <p>
              <strong>Решение принимаете вы сами.</strong> Используйте информацию на свой страх и риск.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
