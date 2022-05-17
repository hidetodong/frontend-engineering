export default function (pluginOptions) {
    return {
        name:'babel',
        options(){
            console.log(pluginOptions)
            return null
        }
    }
}