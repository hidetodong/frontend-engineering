export * from './history'


export function createRouter(options){
    const { history,routes } = options

    const router = {
        install(app){
            console.log('router -install')
            app.component()
        }
    }

    return router
}