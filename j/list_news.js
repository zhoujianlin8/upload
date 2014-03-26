yp.use('jquery.pagination',function(){
    yp.ready(function(){
        if(len>1 && len> page_size){
            fPagination();
        };
        function fPagination(){
            $('#div_page').pagination(len,{
                items_per_page: page_size,
                prev_text:"上一页<i></i>",
                next_text:"下一页<i></i>",
                num_display_entries:8,
                current_page:current_page,   //当前显示页
                num_edge_entries:2,
                link_to:baseUrl,
                callback: function(i){
                    $('#div_page').find('a').each(function(){
                        if($(this).hasClass('next')){
                            var num=i+2;
                            $(this).attr('href',baseUrl+num);
                        } else if($(this).hasClass('prev')){
                            var num=i;
                            $(this).attr('href',baseUrl+num);
                        }else{
                            var num=$(this).text();
                            $(this).attr('href',baseUrl+num);
                        }
                    })
                }
            });
        }
    })
})