function handleCode(str) {
  if (!str) return ''

  str = str.replace(/\n/g, '!@#')
  let newStr = ''
  newStr = str.replace(/<code>(.*?)<\/code>/g, (v, $1) => {
    const code = [];
    const gutter = [];
    const arr = ($1).split('!@#')
    arr.forEach((item, index)=> {
      code.push('<div class="line">' + '&nbsp;' + item + '</div>');
      gutter.push('<div class="line">' + ++index + '</div>');
    });
    
    return  '<code>' +
              '<table style="background:#f7f7f7;margin-bottom:8px;display:inline-flex;width:100%;overflow:auto">' + 
                  '<tr style="background-color: #eff2f3;border: none">'+
                    '<td style="border:none;">' + gutter.join('')+ '</td>'+
                    '<td style="border: none">' + code.join('')+ '</td>'+
                  '</tr>'+
              '</table>'+
            '</code>'
  })
  return newStr.replace(/!@#/g, '\n')
}

export default handleCode