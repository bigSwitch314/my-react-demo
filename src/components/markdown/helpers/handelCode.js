/* eslint-disable */
function handleCode(str) {
  if (!str) return ''

  str = str.replace(/\n/g, '!@#')
  let newStr = ''
  newStr = str.replace(/<code(.*?)>(.+?)<\/code>/g, (v, $1, $2) => {
    const code = [];
    const gutter = [];
    const arr = ($2).split('!@#')
    arr.forEach((item, index)=> {
      code.push('<div class="line">' + '&nbsp;' + item + '</div>');
      gutter.push('<div class="line">' + ++index + '</div>');
    });

    return '<code>' +
              '<table style="background:#f7f7f7;width:100%">' +
                  '<tr style="border: none">'+
                    '<td style="border:none; background-color: #eff2f3; text-align: center; width: 24px">' +
                      gutter.join('') +
                    '</td>'+
                    '<td style="border: none; background-color: #f8f8f8;">' +
                      code.join('') +
                    '</td>'+
                  '</tr>'+
              '</table>'+
            '</code>'
  })
  return newStr.replace(/!@#/g, '\n')
}

export default handleCode