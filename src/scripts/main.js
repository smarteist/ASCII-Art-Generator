// Vendors
import figlet from "figlet";
import fonts from "src/scripts/figletFonts";
import 'src/scripts/vendor/jquery'
import 'src/scripts/vendor/bootstrap'
import 'src/scripts/modules/darkmode-handler'

const fontSelect = jQuery('#fontSelect');
const textInput = jQuery('#textInput');
const widthInput = jQuery('#widthInput');
const mainForm = jQuery('#mainForm')

function copyToClipboard(text) {
  const $temp = $("<textarea/>");
  $("body").append($temp);
  $temp.val(text).select();
  document.execCommand("copy");
  $temp.remove();
}


mainForm.on('change keyup paste', ':input', () => {
  let output = jQuery('#outputArt');
  figlet.text(textInput?.val(), {
    font: fontSelect?.val(),
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: widthInput?.val(),
    whitespaceBreak: true
  }, (err, data) => {
    if (err) {
      output.html('Something went wrong...')
      return;
    }
    output.html(data)
  });
})

fonts.forEach((item) => {
  fontSelect.append(
    jQuery('<option/>')
      .attr('value', item)
      .html(item)
  )
})

mainForm.on('submit', (e) => e.preventDefault())

jQuery(document).on('click', 'a#copyOutput', function (e) {
  e.preventDefault();
  copyToClipboard(jQuery('#outputArt').text())
  const elem = $(this);
  const prev = elem.text();
  elem.text("Copied!");
  setTimeout(() => elem.text(prev), 500)
});

jQuery(document).on('click', 'a#copyOutputEscaped', function (e) {
  e.preventDefault();
  copyToClipboard(JSON.stringify(jQuery('#outputArt').text()).slice(1, -1))
  const elem = $(this);
  const prev = elem.text();
  elem.text("Copied!");
  setTimeout(() => elem.text(prev), 500)
});
