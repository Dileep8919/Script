let ids = ['8834', '8841'];

function processId(id) {
    $.ajax({
        type: 'GET',
        url: `/restapi/vc/messages/id/${id}/metadata/key/cisco.sp_previewURL_long?xslt=json.xsl`,
        success: (res) => {
            if (res.response.value.null !== 'true') {
                let version = res.response.value.$.split(',')[0];
                //cancel process
                $.ajax({
                    type: 'GET',
                    url: "/plugins/custom/cisco/cisco/flagselfpublish",
                    data: {
                        'tid': id,
                        'mode': 'cancel',
                        'version': version,
                        'preState': 'preview1',
                        'xslt': 'json.xsl'
                    },
                    success: (res) => {
                        //initiate process
                        $.ajax({
                            type: 'GET',
                            url: "/plugins/custom/cisco/cisco/flagselfpublish",
                            data: {
                                'tid': id,
                                'mode': 'int',
                                'version': version,
                                'preState': 'cancel',
                                'workFlow' : 'sp',
                                'xslt': 'json.xsl'
                            },
                            success: (res) => {
                                //set licensing group
                                $.ajax({
                                    type: 'POST',
                                    url: `/restapi/vc/messages/id/${id}/metadata/key/cisco.source_group/set?value=Licensing||LicensingAuthoredSP`,
                                    success: (res) => {
                                        //set general content
                                        $.ajax({
                                            type: 'POST',
                                            url: `/restapi/vc/messages/id/${id}/metadata/key/cisco.user_driven/set?value=true,ssarella,Tue Sep 07 2023 15:07:52 GMT+0530 (India Standard Time)`,
                                            success: (res) => {
                                                //preview process
                                                $.ajax({
                                                    type: 'GET',
                                                    url: "/plugins/custom/cisco/cisco/flagselfpublish",
                                                    data: {
                                                        'tid': id,
                                                        'mode': 'preview',
                                                        'version': version,
                                                        'preState': 'internal',
                                                        'xslt': 'json.xsl'
                                                    },
                                                    success: (res) => {
                                                        console.log(id," is submitted for preview process");
                                                    },
                                                    error: (error => {
                                                        console.log(id,'is failed for preview process and error is',error);
                                                    })
                                                });
                                            }
                                        });
                                    }
                                });
                            },
                            error: (error => {
                                console.log(id,'is failed for initiate process and error is',error);
                            })
                        });
                    },
                    error: (error => {
                        console.log(id,'is failed for cancel process and error is',error);
                    })
                });
            } else {
                console.log('Above article doesn\'t have a preview URL');
            }
        }
    });
}

for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    processId(id);
}
