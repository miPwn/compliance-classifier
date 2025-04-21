import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

(async () => {
  try {
    const ref = await bootstrapApplication(AppComponent, appConfig);
    // Application successfully bootstrapped
    console.log('Application bootstrapped successfully');
  } catch (err) {
    console.error('Error bootstrapping application:', err);
  }
})();
