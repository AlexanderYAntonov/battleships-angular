import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PlaygroundService } from './services/playground.service';
import { WsService } from './services/ws.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, PlaygroundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule
  ],
  providers: [PlaygroundService, WsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
