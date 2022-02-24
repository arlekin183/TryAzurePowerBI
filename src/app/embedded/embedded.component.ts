import { Component, ElementRef, ViewChild } from '@angular/core';

import { IReportEmbedConfiguration, models, Page, Report, service, VisualDescriptor } from 'powerbi-client';
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.css']
})
export class EmbeddedComponent {
  @ViewChild(PowerBIReportEmbedComponent) reportObj!: PowerBIReportEmbedComponent;

  reportConfig: IReportEmbedConfiguration = {
    type: "report",
    id: 'fa077a48-c124-4be2-b54d-ff0e9d3596f4', //<Report Id>
    embedUrl: 'https://app.powerbi.com/groups/6fcbe016-8581-4d4d-becc-5f2025efb0b1/reports/fa077a48-c124-4be2-b54d-ff0e9d3596f4/ReportSection1481a410b40081847e28?noSignUpCheck=1',
    // embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=fa077a48-c124-4be2-b54d-ff0e9d3596f4&groupId=6fcbe016-8581-4d4d-becc-5f2025efb0b1',
    tokenType: models.TokenType.Embed,
    accessToken: '', // Keep as empty string, null or undefined
    // hostname: "https://app.powerbi.com"
}
  accessToken = '';
  reportClass = 'report-container hidden';
  isEmbedded = false;
  isBIReportShowed=false;
  eventHandlersMap = new Map<string, (event?: service.ICustomEvent<any>) => void>([
    ['loaded', () => console.log('Report has loaded')],
    [
      'rendered',
      () => {
        console.log('Report has rendered');

        // Set displayMessage to empty when rendered for the first time
        if (!this.isEmbedded) {
        }

        // Update embed status
        this.isEmbedded = true;
      },
    ],
    [
      'error',
      (event?: service.ICustomEvent<any>) => {
        if (event) {
          console.error(event.detail);
        }
      },
    ],
    ['visualClicked', () => console.log('visual clicked')],
    ['pageChanged', (event) => console.log(event)],
  ]);

  constructor(
    private element: ElementRef<HTMLDivElement>,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) { 
    this.accessToken = <string>localStorage.getItem('accessToken');
    this.reportConfig = {
      ...this.reportConfig,
      // embedUrl: 'https://embedded.powerbi.com/appTokenReportEmbed?reportId=fa077a48-c124-4be2-b54d-ff0e9d3596f4',
      accessToken: this.accessToken,
    }
  }  

  showBIReport(){
    this.isBIReportShowed=!this.isBIReportShowed;
    const reportDiv = this.element.nativeElement.querySelector('.report-container');
    if (reportDiv) {
      if(this.isBIReportShowed) {
        reportDiv.classList.remove('hidden');
      } else {
        reportDiv.classList.add('hidden');
      }
    }
  }
}
