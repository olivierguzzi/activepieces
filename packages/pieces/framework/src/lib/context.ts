import { AppConnectionValue, ExecutionType, PauseMetadata, StopResponse, TriggerPayload } from "@activepieces/shared";
import { TriggerStrategy } from "./trigger/trigger";
import { NonAuthPiecePropertyMap, PieceAuthProperty, PiecePropValueSchema, PiecePropertyMap, StaticPropsValue } from "./property";

type BaseContext<PieceAuth extends PieceAuthProperty, Props extends PiecePropertyMap> = {
    auth: PiecePropValueSchema<PieceAuth>,
    propsValue: StaticPropsValue<Props>
    store: Store
}

type AppWebhookTriggerHookContext<PieceAuth extends PieceAuthProperty, TriggerProps extends PiecePropertyMap> =
    BaseContext<PieceAuth, TriggerProps> & {
        webhookUrl: string
        payload: TriggerPayload
        app: {
            createListeners({ events, identifierValue }: { events: string[], identifierValue: string }): Promise<void>
        }
    }

type PollingTriggerHookContext<PieceAuth extends PieceAuthProperty, TriggerProps extends PiecePropertyMap> =
    BaseContext<PieceAuth, TriggerProps> & {
        setSchedule(schedule: {
            cronExpression: string,
            timezone?: string
        }): void
    }

type WebhookTriggerHookContext<PieceAuth extends PieceAuthProperty, TriggerProps extends PiecePropertyMap> =
    BaseContext<PieceAuth, TriggerProps> & {
        webhookUrl: string
        payload: TriggerPayload
    }

export type TriggerHookContext<
    PieceAuth extends PieceAuthProperty,
    TriggerProps extends PiecePropertyMap,
    S extends TriggerStrategy,
> = S extends TriggerStrategy.APP_WEBHOOK
    ? AppWebhookTriggerHookContext<PieceAuth, TriggerProps>
    : S extends TriggerStrategy.POLLING
        ? PollingTriggerHookContext<PieceAuth, TriggerProps>
        : S extends TriggerStrategy.WEBHOOK
            ? WebhookTriggerHookContext<PieceAuth, TriggerProps>
            : never

export type StopHookParams = {
    response: StopResponse
}

export type StopHook = (params: StopHookParams) => void

export type PauseHookPauseMetadata = Omit<PauseMetadata, 'resumeStepMetadata'>

export type PauseHookParams = {
    pauseMetadata: PauseHookPauseMetadata
}

export type PauseHook = (params: PauseHookParams) => void

export type ActionContext<
    PieceAuth extends PieceAuthProperty = PieceAuthProperty,
    ActionProps extends NonAuthPiecePropertyMap = NonAuthPiecePropertyMap,
> = BaseContext<PieceAuth, ActionProps> & {
    executionType: ExecutionType,
    connections: ConnectionsManager,
    run: {
        stop: StopHook,
        pause: PauseHook,
    }
}

export interface ConnectionsManager {
    get(key: string): Promise<AppConnectionValue | Record<string, unknown> | string | null>;
}

export interface Store {
    put<T>(key: string, value: T, scope?: StoreScope): Promise<T>;
    get<T>(key: string, scope?: StoreScope): Promise<T | null>;
    delete(key: string, scope?: StoreScope): Promise<void>;
}

export enum StoreScope {
    // Collection were deprecated in favor of project
    PROJECT = "COLLECTION",
    FLOW = "FLOW"
}
