import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './details/details.component';
import { TotalNumberComponent } from './pages/total-number/total-number.component';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, HomeComponent, DetailsComponent, TotalNumberComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
