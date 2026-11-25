import { useState } from 'react'
import { RotateCcw, Trash2, Timer } from 'lucide-react'

import '../../app/styles/timer.css'


interface TimerRecoveryDialogProps {
    onRestore: () => Promise<void>
    onDiscard: () => Promise<void>
}

function TimerRecoveryDialog({
    onRestore,
    onDiscard
}: TimerRecoveryDialogProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleAction(action: () => Promise<void>) {
        setLoading(true)
        setError(null)

        try {
            await action()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível executar a operação.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="timer-recovery-overlay">
            <div
                className="timer-recovery-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="timer-recovery-title"
            >
                <div className="timer-recovery-icon">
                    <Timer size={28} />
                </div>

                <h2 id="timer-recovery-title">
                    Sessão anterior encontrada
                </h2>

                <p>
                    Existe uma sessão do Timer que ainda não foi encerrada.
                    Deseja continuar de onde parou ou descartá-la?
                </p>

                {error && (
                    <div className="timer-recovery-error">
                        {error}
                    </div>
                )}

                <div className="timer-recovery-actions">
                    <button
                        type="button"
                        className="timer-recovery-restore"
                        disabled={loading}
                        onClick={() => void handleAction(onRestore)}
                    >
                        <RotateCcw size={17} />
                        Restaurar sessão
                    </button>

                    <button
                        type="button"
                        className="timer-recovery-discard"
                        disabled={loading}
                        onClick={() => void handleAction(onDiscard)}
                    >
                        <Trash2 size={17} />
                        Descartar sessão
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TimerRecoveryDialog
