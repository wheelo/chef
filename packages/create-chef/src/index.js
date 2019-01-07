import { createPlugin } from '@chef/chef-core';


export default createPlugin({
    provides() {
    },
    middleware: () => {

        return (ctx, next) => {

            return next();
        };
    }
});