import puppeteer from "puppeteer";

export async function aseo_la_reina(rol,dv){
  // measurement_date info
  const fechaActual = new Date();

  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1;
  const año = fechaActual.getFullYear();
  const hora = fechaActual.getHours();
  const minutos = fechaActual.getMinutes();
  const segundos = fechaActual.getSeconds();

  const fechaFormateada = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
 
  // Puppeteer

  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1280, height: 720 },
  });

  const page= await browser.newPage()

  // La Reina without captcha
  const url=`https://sertex1.stonline.cl/La_Reina/Aseo/asp/asignarut.asp?MZN=${rol}&PDO=${dv}`

  try{
    await page.goto(url,{timeout:5000})

  } catch {
    // Predio wrong 
    return {
      data: [
        {
          id: rol + "-" + dv,
          measurement_date: fechaFormateada,
          invoice_amount: "Sin deuda/No registrado",
        },
      ],
    };
  }

  // In debt info
  await page.waitForSelector('tr:nth-child(8) > td:nth-child(8) > div',{timeout:5000})

  const total= await page.evaluate(() =>{
    const result= parseInt(document.querySelector('tr:nth-child(8) > td:nth-child(8) > div').innerText.replace('$','').replace('.','').replace(' ',''))
    return result
  })
  
  if (total>0){
    return {
      data: [
        {
          id: rol + "-" + dv,
          measurement_date: fechaFormateada,
          invoice_amount: total,
        },
      ],
    };
  } else {
    return {
      data: [
        {
          id: rol + "-" + dv,
          measurement_date: fechaFormateada,
          invoice_amount: "Sin deuda/No registrado",
        },
      ],
    };
  }

}


export default aseo_la_reina

