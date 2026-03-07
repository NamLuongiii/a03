'use client'

import React, {createContext, useCallback, useContext, useState} from 'react'
import {AlertDialog, Button} from "@heroui/react";


interface AlertConfig {
    isOpen: boolean
    type: "success" | "danger" | "warning",
    title: string
    message: string
    onConfirm?: () => void
    onCancel?: () => void
}

interface AlertContextType {
    success: (message: string, title: string, onConfirm?: () => void) => void
    error: (message: string, title: string, onConfirm?: () => void) => void
    confirm: (message: string, title: string, onConfirm?: () => void) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertDialogProvider = ({children}: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<AlertConfig>({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
        onConfirm: undefined
    })

    const close = () => setConfig((prev) => ({...prev, isOpen: false}))

    const success = useCallback((message: string, title = 'Thành công', onConfirm?: () => void) => {
        setConfig({
            isOpen: true,
            type: 'success',
            title,
            message,
            onConfirm: () => {
                if (onConfirm) onConfirm()
                close()
            }
        })
    }, [])

    const error = useCallback((message: string, title = 'Lỗi', onConfirm?: () => void) => {
        setConfig({
            isOpen: true,
            type: 'danger',
            title, message,
            onConfirm: () => {
                if (onConfirm) onConfirm()

                close()
            }
        })
    }, [])

    const confirm = useCallback((message: string, title = 'Xác nhận', onConfirm?: () => void) => {
        setConfig({
            isOpen: true,
            type: 'warning',
            title,
            message,
            onConfirm: () => {
                if (onConfirm) onConfirm()
                close()
            },
        })
    }, [])


    return (
        <AlertContext.Provider value={{success, error, confirm}}>
            {children}

            {/* UI DIALOG - Hello World Section */}
            <AlertDialog isOpen={config.isOpen} onOpenChange={close}>
                <AlertDialog.Backdrop>
                    <AlertDialog.Container>
                        <AlertDialog.Dialog>
                            <AlertDialog.CloseTrigger/>
                            <AlertDialog.Header>
                                <AlertDialog.Icon status={config.type}/>
                                <AlertDialog.Heading>{config.title}</AlertDialog.Heading>
                            </AlertDialog.Header>
                            <AlertDialog.Body>
                                <p>
                                    {config.message}
                                </p>
                            </AlertDialog.Body>
                            {config.type === 'danger' ? (
                                <AlertDialog.Footer>
                                    <Button slot="close" variant="tertiary">
                                        Cancel
                                    </Button>
                                    <Button slot="close"
                                            variant='danger'
                                            onClick={config.onConfirm}>
                                        Confirm
                                    </Button>
                                </AlertDialog.Footer>
                            ) : (
                                <AlertDialog.Footer>
                                    <Button slot="close"
                                            fullWidth
                                            onClick={config.onConfirm}>
                                        Hoàn thành
                                    </Button>
                                </AlertDialog.Footer>
                            )}

                        </AlertDialog.Dialog>
                    </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>
        </AlertContext.Provider>
    )
}

// Hook để sử dụng
// eslint-disable-next-line react-refresh/only-export-components
export const useAlerts = () => {
    const context = useContext(AlertContext)
    if (!context) {
        throw new Error('useAlerts must be used within an AlertDialogProvider')
    }
    return context
}