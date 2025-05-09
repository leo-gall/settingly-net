import { useConfirm } from '@/composables/utils/useConfirm';
import useCurrentProjectStore from '@/stores/useCurrentProjectStore';
import { usePocketbaseStore } from '@/stores/usePocketbaseStore';
import type { FileVersion } from '@/types/files';
import getNewestFileVersion from '@/utils/get-newest-file-version';
import { trackUmamiEvent } from '@jaseeey/vue-umami-plugin';
import { storeToRefs } from 'pinia';
import type { ClientResponseError } from 'pocketbase';
import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';

export default function useJsonFileEditor() {
  const jsonError = ref('');
  const configString = ref(ref(JSON.stringify({}, null, 2)));
  const isSaving = ref(false);

  const { currentFile, fileVersions } = storeToRefs(useCurrentProjectStore());
  const { confirmDialog } = useConfirm();
  const { pocketbase } = usePocketbaseStore();

  function format() {
    try {
      const parsed = JSON.parse(configString.value);
      configString.value = JSON.stringify(parsed, null, 2);
      jsonError.value = '';
      toast.success('JSON formatted successfully');
    } catch (e) {
      jsonError.value = 'Invalid JSON: ' + (e as Error).message;
    }
  }

  // Update the config when JSON changes
  const updateFromJson = () => {
    try {
      JSON.parse(configString.value);
      jsonError.value = '';
    } catch (e) {
      jsonError.value = 'Invalid JSON: ' + (e as Error).message;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(configString.value).then(() => {
      toast.success('Copied to clipboard');
    });
  };

  const resetToUnsaved = async () => {
    if (typeof currentFile.value !== 'undefined') {
      if (await confirmDialog('Are you sure you want to reset the file to its unsaved state?')) {
        configString.value = JSON.stringify(
          getNewestFileVersion(currentFile.value!)!.content,
          null,
          2,
        );
        toast.success('File reset to unsaved state');
      }
    }
  };

  const save = async () => {
    if (currentFile.value) {
      isSaving.value = true;
      let formattedJson = '';

      try {
        const parsed = JSON.parse(configString.value);
        formattedJson = JSON.stringify(parsed, null, 2);
      } catch (e) {
        toast.error('Invalid JSON: ' + (e as Error).message);
        isSaving.value = false;
        return;
      }

      const newestVersion = getNewestFileVersion(currentFile.value);

      if (!newestVersion) {
        toast.error('No file version found.');
        isSaving.value = false;
        return;
      }

      if (JSON.stringify(newestVersion.content, null, 2) === formattedJson) {
        toast.info('No changes detected');
        isSaving.value = false;
        return;
      }

      try {
        const createdVersion = await pocketbase.collection('file_versions').create<FileVersion>({
          file: currentFile.value.id,
          content: formattedJson,
        });

        fileVersions.value.push(createdVersion);

        trackUmamiEvent('update_file', {
          fileId: currentFile.value.id,
          fileName: currentFile.value.name,
          fileDescription: currentFile.value.description,
          projectId: currentFile.value.project,
        });

        toast.success('File updated successfully');
      } catch (e) {
        toast.error((e as ClientResponseError).message);
      } finally {
        isSaving.value = false;
      }
    }
  };

  watch(
    () => currentFile.value,
    (newFile) => {
      if (newFile) {
        const newestVersion = getNewestFileVersion(newFile);

        if (newestVersion) {
          configString.value = JSON.stringify(newestVersion.content, null, 2);
        }
      }
    },
    { immediate: true, deep: true },
  );

  return {
    configString,
    format,
    copyToClipboard,
    resetToUnsaved,
    updateFromJson,
    save,
    jsonError,
    isSaving,
  };
}
