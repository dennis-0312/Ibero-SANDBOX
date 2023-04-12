/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/url'],
    /**
     * @param{https} https
     * @param{url} url
     */
    (https, url) => {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        const pageInit = (scriptContext) => {
            console.log('Init')
        }

        const executeRestlet = (action, account, amount, account2) => {
            try {
                console.log(account, amount, account2);
                if (action != 0 && account != 0 && amount != 0 && account2 != 0) {
                    const headerObj = { name: 'Accept-Language', value: 'en-us' };
                    const urlUpdateStock = url.resolveScript({ scriptId: 'customscript_ts_rs_paymentbutton', deploymentId: 'customdeploy_ts_rs_paymentbutton' });
                    let response = https.get({ url: urlUpdateStock + '&taskAction=' + action + '&account=' + account + '&amount=' + amount + '&account2=' + account2, headers: headerObj });
                    console.log(response.body);
                    alert(response.body);
                    location.reload();
                } else {
                    alert('Debe ingresar todos los campos para esta operación.')
                }
            } catch (error) {
                console.log(error);
            }
        }

        return {
            pageInit: pageInit,
            executeRestlet: executeRestlet

        };

    });
